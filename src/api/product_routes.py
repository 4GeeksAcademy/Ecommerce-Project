from flask import Blueprint, request, jsonify
from api.models import db, Product, Variant, Category, User, Subcategory
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from functools import wraps
from .utils import admin_required

product = Blueprint('shop_catalog', __name__)


## Rutas Públicas para consultar productos ##

# Traer todos los productos y filtro
# Obtengo una lista con todos los productos, me permite filtrar por categorías

@product.route("/products", methods=["GET"])
def get_products():
    # Lógica para filtrar
    category = request.args.get("category")
    subcategory_id = request.args.get("subcategory_id")
    size = request.args.get("size")
    color = request.args.get("color")

    # Iniciar consulta base
    query = Product.query

<<<<<<< HEAD
=======
    # Filtrar por categoría
>>>>>>> 80c99c6c5a32400074c7ef98173c84aa72cce843
    if category:
        query = query.join(Category).filter(Category.name == category)
    
    # Filtrar por subcayegoria
    if subcategory_id:
        query = query.filter(Product.subcategory_id == subcategory_id)
    
    # 4. Filtrar por Variantes (Talla y/o Color)
    # Si viene alguno de estos, necesitamos hacer un join con la tabla Variant
    if size or color:
        query = query.join(Variant)
        if size:
            query = query.filter(Variant.size == size)
        if color:
            query = query.filter(Variant.color == color)

    # Evitar duplicados
    #products = query.all()
    products = query.distinct().all()

    # Incluimos variantes de productos (tallas, colores, ect) en la vista general para que el cliente sepa qué opciones hay
    return jsonify([p.serialize(include_variants=True) for p in products]), 200


# Traer un solo producto con sus variantes tallas, color, etc

@product.route("/products/<int:product_id>", methods=["GET"])
def get_single_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    # include_variants=True para mostrar tallas, colores y sus stocks
    return jsonify(product.serialize(include_variants=True)), 200

# Obtener categorías de productos (ID)


@product.route("/category/<int:category_id>/products", methods=["GET"])
def get_products_by_category(category_id):
    products = Product.query.filter_by(category_id=category_id).all()
    if not products:
        return jsonify({"msg": "No se encontraron productos en esta categoría", "products": []}), 200

    return jsonify([p.serialize() for p in products]), 200

# Listar todas las categorías para poblar el front


@product.route("/categories", methods=["GET"])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.serialize() for c in categories]), 200


# Endpoints de administración de productos

# 1. Crear producto
@product.route('/products', methods=['POST'])
@admin_required
def create_product(admin_user):
    """Crea un nuevo producto base (sin variantes inicialmente)."""
    data = request.get_json() or {}

    # Campos requeridos
    name = data.get('name')
    base_price = data.get('base_price')
    category_id = data.get('category_id')
<<<<<<< HEAD

=======
    subcategory_id = data.get('subcategory_id') 
    
>>>>>>> 80c99c6c5a32400074c7ef98173c84aa72cce843
    if not all([name, base_price, category_id]):
        return jsonify({"msg": "Faltan campos obligatorios: name, base_price, category_id"}), 400

    # Verificar si la categoría existe
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Categoría no encontrada"}), 404
    
    # Verificar subcategoría si viene
    subcategory = None
    if subcategory_id:
        subcategory = Subcategory.query.get(subcategory_id)
        if not subcategory:
            return jsonify({"msg": "Subcategoría no encontrada"}), 404

    try:
        new_product = Product(
            name=name,
            description=data.get('description'),
            base_price=base_price,
            image_url=data.get('image_url'),
            category_id=category_id,
            subcategory_id=subcategory_id
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"msg": "Producto creado", "product": new_product.serialize()}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear el producto", "error": str(e)}), 500


# 2. Actualizar producto

@product.route("/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(admin_user, product_id):
    """Actualiza la información base de un producto"""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    data = request.get_json() or {}

    # Actualizar solo si el campo está presente
    if 'name' in data:
        product.name = data['name']
    if 'description' in data:
        product.description = data['description']
    if 'base_price' in data:
        product.base_price = data['base_price']
    if 'image_url' in data:
        product.image_url = data['image_url']
    if 'category_id' in data:
        # Verificar la nueva categoría
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({"msg": "Nueva Categoría no encontrada"}), 404
        product.category_id = data['category_id']
    if 'subcategory_id' in data:   
        subcategory = Subcategory.query.get(data['subcategory_id'])
        if not subcategory:
            return jsonify({"msg": "Nueva Subcategoría no encontrada"}), 404
        product.subcategory_id = data['subcategory_id']
        

    try:
        db.session.commit()
        return jsonify({"msg": "Producto actualizado", "product": product.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar el producto", "error": str(e)}), 500


# 3. Eliminar producto

@product.route("/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(admin_user, product_id):
    """Elimina un producto y todas sus variantes"""
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    try:
        db.session.delete(product)
        db.session.commit()
        # 204 No Content
        return jsonify({"msg": f"Producto ID {product_id} y sus variantes eliminados"}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar el producto. Posiblemente existan órdenes vinculadas.", "error": str(e)}), 400


# Categorías: Crear una nueva categoría (Post)

@product.route("/categories", methods=["POST"])
@admin_required
def create_category(admin_user):
    data = request.get_json() or {}
    name = data.get('name')

    if not name:
        return jsonify({"msg": "El nombre de la categoría es requerido"}), 400

    if Category.query.filter_by(name=name).first():
        return jsonify({"msg": "La categoría ya existe"}), 409

    try:
        new_category = Category(name=name)
        db.session.add(new_category)
        db.session.commit()
        return jsonify({"msg": "Categoría creada", "category": new_category.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear la categoría", "error": str(e)}), 500

# Categorías: Actualizar categoría (Put) => Actualizar nombre de cat existente


@product.route("/categories/<int:category_id>", methods=["PUT"])
@admin_required
def update_category(admin_user, category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Categoría no encontrada"}), 404

    data = request.get_json() or {}
    new_name = data.get("name")

    if not new_name:
        return jsonify({"msg": "Nuevo nombre de categoría es requerido"}), 400

    # Verificar si el nombre nuevo existe
    if Category.query.filter(Category.name == new_name, Category.id != category_id).first():
        return jsonify({"msg": "Ya existe otra categoría con ese nombre"}), 409

    try:
        category.name = new_name
        db.session.commit()
        return jsonify({"msg": "Categoría actualizada", "category": category.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la categoría", "error": str(e)}), 500


# Categorías: Eliminar una categoría (Delete)

@product.route('/categories/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(admin_user, category_id):
    """Elimina una categoría."""
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Categoría no encontrada"}), 404

    if category.products:
        return jsonify({"msg": "No se puede eliminar la categoría. Primero desvincule o elimine los productos asociados."}), 400

    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({"msg": f"Categoría ID {category_id} eliminada"}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar la categoría", "error": str(e)}), 500


# Administración de las variantes de productos

# 4. Añadir variante (talla/color) a un producto

@product.route("/products/<int:product_id>/variants", methods=["POST"])
@admin_required
def add_variant(admin_user, product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto no encontrado"}), 404

    data = request.get_json() or {}
    size = data.get('size')
    color = data.get('color')
    stock = data.get('stock', 0)

    if not all([size, color]):
        return jsonify({"msg": "Talla y color son requeridos"}), 400

    try:
        new_variant = Variant(
            product_id=product_id,
            size=size,
            color=color,
            stock=stock
        )
        db.session.add(new_variant)
        db.session.commit()
        return jsonify({"msg": "Variante añadida", "variant": new_variant.serialize()}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({"msg": "Error: Ya existe una variante con la misma talla y color para este producto."}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error desconocido al añadir variante", "error": str(e)}), 500


# 5. Actualizar variantes

@product.route("/products/<int:product_id>/variants/<int:variant_id>", methods=["PUT"])
@admin_required
def update_variant(admin_user, product_id, variant_id):

    # 1. Verificar si el producto existe
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"msg": "Producto padre no encontrado"}), 404

    # 2. Encontrar la variante
    variant = Variant.query.filter_by(
        id=variant_id, product_id=product_id).first()
    if not variant:
        return jsonify({"msg": "Variante no encontrada para este producto"}), 404

    data = request.get_json() or {}

    # Actualizar solo si el campo está presente
    if 'size' in data:
        variant.size = data['size']
    if 'color' in data:
        variant.color = data['color']
    if 'stock' in data:
        # Aseguramos que el stock sea un un numero entero válido
        try:
            variant.stock = int(data['stock'])
        except ValueError:
            return jsonify({"msg": "El stock debe ser un número entero válido"}), 400

    try:
        db.session.commit()
        return jsonify({"msg": "Variante actualizada", "variant": variant.serialize()}), 200
    except IntegrityError:
        # Esto captura si el nuevo size/color ya existe para este producto
        db.session.rollback()
        return jsonify({"msg": "Error: Ya existe otra variante con la misma talla y color para este producto."}), 409
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la variante", "error": str(e)}), 500


# 6. Eliminar la variante

@product.route('/products/<int:product_id>/variants/<int:variant_id>', methods=['DELETE'])
@admin_required
def delete_variant(admin_user, product_id, variant_id):
    """Elimina una variante específica de un producto."""

    # 1. Encontrar la variante
    variant = Variant.query.filter_by(
        id=variant_id, product_id=product_id).first()
    if not variant:
        return jsonify({"msg": "Variante no encontrada para este producto"}), 404

    try:
        db.session.delete(variant)
        db.session.commit()
        return jsonify({"msg": f"Variante ID {variant_id} eliminada"}), 204
    except Exception as e:
        db.session.rollback()
        # Si hay OrderItems o CartItems, lanza un error
        return jsonify({"msg": "Error al eliminar la variante. Posiblemente está vinculada a órdenes o carritos.", "error": str(e)}), 400


# Endpoint de búsqueda y filtrado de productos - GET (busca prod. basados en parámetros de consultas query params)

@product.route('/search', methods=['GET'])
def search_products():

    # Obtener parámetros de la URL
    q = request.args.get('q')  # Texto de búsqueda (nombre o descripción)
    category_id = request.args.get('category_id')
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')

    # Base de la consulta
    query = Product.query

    # 1. Filtrar por texto (nombre o descripción)
    if q:
        # Usamos icontains para una búsqueda insensible a mayúsculas/minúsculas y parcial
        search_filter = Product.name.ilike(
            f'%{q}%') | Product.description.ilike(f'%{q}%')
        query = query.filter(search_filter)

    # 2. Filtrar por categoría
    if category_id:
        try:
            category_id = int(category_id)
            query = query.filter(Product.category_id == category_id)
        except ValueError:
            return jsonify({"msg": "category_id debe ser un número entero"}), 400

    # 3. Filtrar por rango de precio (precio mínimo)
    if min_price:
        try:
            min_price = float(min_price)
            query = query.filter(Product.base_price >= min_price)
        except ValueError:
            return jsonify({"msg": "min_price debe ser un número"}), 400

    # 4. Filtrar por rango de precio (precio máximo)
    if max_price:
        try:
            max_price = float(max_price)
            query = query.filter(Product.base_price <= max_price)
        except ValueError:
            return jsonify({"msg": "max_price debe ser un número"}), 400

    # Ejecutar la consulta
    products = query.all()

    if not products:
        return jsonify({"msg": "No se encontraron productos que coincidan con los criterios."}), 404

    return jsonify([p.serialize() for p in products]), 200
<<<<<<< HEAD
=======

# Crear subcategoría
@product.route("/subcategories", methods=["POST"])
@admin_required
def create_subcategory(admin_user):
    data = request.get_json() or {}
    name = data.get("name")
    category_id = data.get("category_id")

    if not name or not category_id:
        return jsonify({"msg": "Nombre y category_id son requeridos"}), 400

    # Verificar que la categoría exista
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"msg": "Categoría no encontrada"}), 404

    if Subcategory.query.filter_by(name=name, category_id=category_id).first():
        return jsonify({"msg": "Ya existe una subcategoría con ese nombre en esta categoría"}), 409

    try:
        new_sub = Subcategory(name=name, category_id=category_id)
        db.session.add(new_sub)
        db.session.commit()
        return jsonify({"msg": "Subcategoría creada", "subcategory": new_sub.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al crear la subcategoría", "error": str(e)}), 500


# Listar todas las subcategorías
@product.route("/subcategories", methods=["GET"])
def get_subcategories():
    subs = Subcategory.query.all()
    return jsonify([s.serialize() for s in subs]), 200


# Obtener subcategorías por categoría
@product.route("/categories/<int:category_id>/subcategories", methods=["GET"])
def get_subcategories_by_category(category_id):
    subs = Subcategory.query.filter_by(category_id=category_id).all()
    return jsonify([s.serialize() for s in subs]), 200


# Actualizar subcategoría
@product.route("/subcategories/<int:subcategory_id>", methods=["PUT"])
@admin_required
def update_subcategory(admin_user, subcategory_id):
    sub = Subcategory.query.get(subcategory_id)
    if not sub:
        return jsonify({"msg": "Subcategoría no encontrada"}), 404

    data = request.get_json() or {}
    new_name = data.get("name")

    if not new_name:
        return jsonify({"msg": "Nuevo nombre requerido"}), 400

    if Subcategory.query.filter(Subcategory.name == new_name, Subcategory.id != subcategory_id).first():
        return jsonify({"msg": "Ya existe otra subcategoría con ese nombre"}), 409

    try:
        sub.name = new_name
        db.session.commit()
        return jsonify({"msg": "Subcategoría actualizada", "subcategory": sub.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al actualizar la subcategoría", "error": str(e)}), 500


# Eliminar subcategoría
@product.route("/subcategories/<int:subcategory_id>", methods=["DELETE"])
@admin_required
def delete_subcategory(admin_user, subcategory_id):
    sub = Subcategory.query.get(subcategory_id)
    if not sub:
        return jsonify({"msg": "Subcategoría no encontrada"}), 404

    if sub.products:
        return jsonify({"msg": "No se puede eliminar la subcategoría. Primero desvincule o elimine los productos asociados."}), 400

    try:
        db.session.delete(sub)
        db.session.commit()
        return jsonify({"msg": f"Subcategoría ID {subcategory_id} eliminada"}), 204
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar la subcategoría", "error": str(e)}), 500


>>>>>>> 80c99c6c5a32400074c7ef98173c84aa72cce843
