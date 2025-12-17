from flask import Blueprint, request, jsonify
from .models import db, Cart, CartItem, Variant, Order, OrderItem, User
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import jwt_required, get_jwt_identity
from .utils import admin_required

cart_order = Blueprint('cart_order', __name__)

# Función que usaré para obtener usuario a partir del token


def get_current_user_from_jwt():
    user_id = get_jwt_identity()
    return User.query.get(user_id)


# ENDPOINTS DE CARRITO DE COMPRAS

# Obtener el contenido del carrito del usuario

@cart_order.route("/cart", methods=["GET"])
@jwt_required()  # Protejo mi ruta
def get_cart():
    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        # Si el usuario no tiene carrito, se crea uno automáticamente
        cart = Cart(user_id=current_user.id)
        db.session.add(cart)
        db.session.commit()

    return jsonify(cart.serialize()), 200

# Añadir producto variante de productos a carrito - POST


@cart_order.route("/cart/add", methods=["POST"])
@jwt_required()
def add_to_cart():
    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    variant_id = data.get('variant_id')
    quantity = data.get('quantity', 1)

    variant = Variant.query.get(variant_id)
    if not variant:
        return jsonify({"msg": "Variante de producto no encontrada"}), 404

    if not isinstance(quantity, int) or quantity <= 0:
        return jsonify({"msg": "La cantidad debe ser un número entero positivo"}), 400

    # 1. Verificar stock inicial
    if quantity > variant.stock:
        return jsonify({"msg": f"Stock insuficiente. Solo quedan {variant.stock} unidades."}), 400

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        cart = Cart(user_id=current_user.id)
        db.session.add(cart)
        db.session.flush()  # Para obtener el ID si es nuevo

    # 2. Buscar si la variante ya existe en el carrito
    cart_item = CartItem.query.filter_by(
        cart_id=cart.id, variant_id=variant_id).first()

    if cart_item:
        # 3. Si existe, actualizar cantidad (simple adición)
        new_quantity = cart_item.quantity + quantity
        if new_quantity > variant.stock:
            return jsonify({"msg": f"La cantidad total excede el stock disponible ({variant.stock})."}), 400
        cart_item.quantity = new_quantity
    else:
        # 4. Si no existe, crear un nuevo CartItem
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=variant.product_id,
            variant_id=variant_id,
            quantity=quantity
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"msg": "Ítem añadido/actualizado en el carrito", "cart": cart.serialize()}), 200

# Actualizar la cantidad de un item específico en el carrito - PUT


@cart_order.route("/cart/item/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_cart_item(item_id):
    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json() or {}
    new_quantity = data.get('quantity')

    if not isinstance(new_quantity, int) or new_quantity <= 0:
        return jsonify({"msg": "La cantidad debe ser un número entero positivo"}), 400

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"msg": "El carrito no existe"}), 404

    cart_item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not cart_item:
        return jsonify({"msg": "Ítem de carrito no encontrado"}), 404

    variant = cart_item.variant

    # Verificar stock
    if new_quantity > variant.stock:
        return jsonify({"msg": f"Stock insuficiente. Solo quedan {variant.stock} unidades."}), 400

    try:
        cart_item.quantity = new_quantity
        db.session.commit()
        return jsonify({"msg": "Cantidad actualizada", "cart": cart.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la cantidad", "error": str(e)}), 500

# Eliminar un item del carrito de compras - DELETE


@cart_order.route("/cart/item/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_cart_item(item_id):
    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return jsonify({"msg": "El carrito no existe"}), 404

    cart_item = CartItem.query.filter_by(id=item_id, cart_id=cart.id).first()
    if not cart_item:
        return jsonify({"msg": "Ítem de carrito no encontrado"}), 404

    try:
        db.session.delete(cart_item)
        db.session.commit()

        updated_cart = Cart.query.filter_by(user_id=current_user.id).first()
        return jsonify({"msg": "Ítem eliminado del carrito", "cart": updated_cart.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar el ítem", "error": str(e)}), 500


# ENDPOINTS DE CHECKOUT - ORDENES

# Crear ordenes (POST) - Procesa el carrito y crea un orden nueva

@cart_order.route("/checkout", methods=["POST"])
@jwt_required()
def checkout():

    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    data = request.get_json()
    # Los datos de envío se usan aquí
    # Usar dirección del perfil si no se proporciona
    shipping_address = data.get('shipping_address', current_user.address)
    city = data.get('city')
    region = data.get('region')
    zip_code = data.get('zip_code')

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart or not cart.items:
        return jsonify({"msg": "El carrito está vacío."}), 400

    total_amount = 0
    order_items_list = []

    try:
        # 1. Creación de la Orden 
        new_order = Order(
            user_id=current_user.id,
            status="Pending",
            shipping_address=shipping_address,
            city=city,
            region=region,
            zip_code=zip_code,
        )
        db.session.add(new_order)
        db.session.flush()

        # 2. Procesar ítems y verificar stock final
        for cart_item in cart.items:
            variant = cart_item.variant

            if cart_item.quantity > variant.stock:
                # Revertir todo si hay falta de stock
                raise ValueError(
                    f"Stock insuficiente para {variant.product.name} ({variant.size}/{variant.color}). Disponible: {variant.stock}")

            # 3. Crear OrderItem

            price = float(variant.product.base_price)
            order_item = OrderItem(
                order_id=new_order.id,
                variant_id=variant.id,
                quantity=cart_item.quantity,
                price_at_purchase=price
            )
            order_items_list.append(order_item)

            # 4. Descontar stock (Modificación crítica de inventario)
            variant.stock -= cart_item.quantity

            # 5. Calcular total
            total_amount += price * cart_item.quantity

        # 6. Finalizar Orden y Limpiar Carrito
        new_order.total_amount = total_amount
        db.session.add_all(order_items_list)

        db.session.delete(cart)

        db.session.commit()

        return jsonify({"msg": "Orden creada exitosamente", "order": new_order.serialize()}), 201

    except ValueError as e:
        db.session.rollback()
        return jsonify({"msg": f"Error de inventario: {str(e)}"}), 400
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Error al procesar la orden debido a un problema de la base de datos."}), 500
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Ocurrió un error inesperado: {str(e)}"}), 500

# Obtener ordenes realizadas por el usuario - GET


@cart_order.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    current_user = get_current_user_from_jwt()
    if not current_user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    orders = Order.query.filter_by(user_id=current_user.id).all()
    if not orders:
        return jsonify({"msg": "No tienes órdenes registradas."}), 404

    return jsonify([o.serialize() for o in orders]), 200

# Administración de órdenes

#   Obtener órdenes registradas en el sistema - GET


@cart_order.route("/admin/orders", methods=["GET"])
@admin_required
def get_all_orders(admin_user):
    orders = Order.query.all()
    if not orders:
        return jsonify({"msg": "No hay órdenes en el sistema."}), 404

    return jsonify([o.serialize() for o in orders]), 200


# Actualizar el estado de una orden específica - PUT
@cart_order.route("/admin/orders/<int:order_id>/status", methods=["PUT"])
@admin_required
def update_order_status(admin_user, order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({"msg": "Orden no encontrada"}), 404

    data = request.get_json() or {}
    new_status = data.get('status')

    VALID_STATUSES = ["Pending", "Shipped", "Delivered", "Cancelled"]

    if not new_status or new_status not in VALID_STATUSES:
        return jsonify({"msg": f"Estado inválido. Debe ser uno de: {', '.join(VALID_STATUSES)}"}), 400

    # Lógica adicional para manejo de stock si se cancela la orden
    if new_status == "Cancelled" and order.status != "Cancelled":
        # Si la orden se está CANCELANDO por primera vez, se revierte el stock.
        for item in order.items:
            variant = item.variant
            if variant:
                variant.stock += item.quantity

    # Aquí prevenimos la doble reversión.

    try:
        order.status = new_status
        db.session.commit()
        return jsonify({"msg": f"Estado de la orden {order_id} actualizado a {new_status}", "order": order.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el estado de la orden", "error": str(e)}), 500
