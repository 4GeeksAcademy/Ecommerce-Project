from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone, timedelta
from sqlalchemy import Numeric, String, Boolean
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))
    name = db.Column(db.String(120))
    last_name = db.Column(db.String(120))
    address = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, nullable=False)

    # Relaciones
    orders = db.relationship("Order", backref="user", lazy=True)
    cart = db.relationship("Cart", backref="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "is_admin": self.is_admin,
            "name": self.name,
            "last_name": self.last_name,
            "address": self.address,
            "is_active": self.is_active
        }


class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    # Relacion con productos
    products = db.relationship("Product", backref="category", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class Product(db.Model):
    __tablename__ = "products"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    base_price = db.Column(Numeric(10, 2), nullable=False)
    image_url = db.Column(db.String(500), nullable=True)
    # stock = db.Column(db.Integer, default=0)

    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"))

    # Relación con Variant: Un producto tiene muchas variantes
    variants = db.relationship(
        'Variant', backref='product', lazy=True, cascade="all, delete-orphan")

    @property
    def total_stock(self):
        """Calcula y devuelve la suma del stock de todas sus variantes"""
        # Me aseguro de cargar variantes lazy=true
        return sum(v.stock for v in self.variants)

    def serialize(self, include_variants=False):
        data = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "base_price": float(self.base_price),
            "image_url": self.image_url,
            "stock": self.total_stock,
            "category": self.category.name if self.category else None,
        }
        if include_variants:
            data["variants"] = [v.serialize() for v in self.variants]
        return data


class Variant(db.Model):
    __tablename__ = "variants"
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(10), nullable=False)  # S, M, L, XL
    color = db.Column(db.String(50), nullable=False)  # Blanco, Negro, Azul
    stock = db.Column(db.Integer, default=0)  # Stock real

    # FK: Apunta al Producto padre
    product_id = db.Column(db.Integer, db.ForeignKey(
        "products.id"), nullable=False)

    # La clave compuesta asegura que no haya dos veces la misma talla y color para el mismo producto
    __table_args__ = (db.UniqueConstraint('product_id', 'size',
                      'color', name='_product_size_color_uc'),)

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "size": self.size,
            "color": self.color,
            "stock": self.stock
        }


class Order(db.Model):
    __tablename__ = "orders"
    id = db.Column(db.Integer, primary_key=True)
    total_amount = db.Column(db.Float, nullable=False)
    # Pending, Shipped, Delivered
    status = db.Column(db.String(50), default="Pending")
    created_at = db.Column(
        db.DateTime, default=lambda: datetime.now(timezone.utc))
    # Campos de envío para el checkout (Frame: Checkout)
    shipping_address = db.Column(db.String(255))
    city = db.Column(db.String(100))
    region = db.Column(db.String(100))
    zip_code = db.Column(db.String(20))

    # Relación con OrderItem: Una orden tiene muchos ítems
    items = db.relationship('OrderItem', backref='order',
                            lazy=True, cascade="all, delete-orphan")

    # FK
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "total_amount": self.total_amount,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
            "shipping_address": self.shipping_address,
            "items": [item.serialize() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = "order_items"
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey(
        'orders.id'), nullable=False)
    variant_id = db.Column(db.Integer, db.ForeignKey(
        'variants.id'), nullable=False)  # Referencia a la Variante específica
    quantity = db.Column(db.Integer, nullable=False)
    # Precio al momento de la compra
    price_at_purchase = db.Column(db.Float, nullable=False)

    # product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    # product = db.relationship("Product", lazy=True)

    # Relación: cada OrderItem apunta a una Variant
    variant = db.relationship('Variant')

    def serialize(self):
        return {
            "id": self.id,
            "variant_id": self.variant_id,
            "quantity": self.quantity,
            "price_at_purchase": self.price_at_purchase,
            "product_name": self.variant.product.name if self.variant else None,
            "size": self.variant.size if self.variant else None,
            "color": self.variant.color if self.variant else None,
        }


class Cart(db.Model):
    __tablename__ = "carts"
    id = db.Column(db.Integer, primary_key=True)

    # 1 usuario con 1 carrito
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    items = db.relationship("CartItem", backref="cart",
                            lazy=True, cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [item.serialize() for item in self.items]
        }


class CartItem(db.Model):
    __tablename__ = "cart_items"
    id = db.Column(db.Integer, primary_key=True)
    quantity = db.Column(db.Integer, default=1)

    # FKs
    cart_id = db.Column(db.Integer, db.ForeignKey("carts.id"))
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"))
    variant_id = db.Column(db.Integer, db.ForeignKey("variants.id"))

    # Relación: Para obtener los datos de la variante y el producto padre
    variant = db.relationship("Variant", lazy=True)
    product = db.relationship("Product", lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "quantity": self.quantity,
            "product_id": self.product_id,
            "variant_id": self.variant_id,
            "product": self.product.serialize() if self.product else None,
            "size": self.variant.size if self.variant else None,
            "color": self.variant.color if self.variant else None,
        }
