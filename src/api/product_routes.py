from flask import Blueprint, request, jsonify
from api.models import db, Product, Variant, Category, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from functools import wraps


product = Blueprint('product', __name__)

# Definir un "decorador" personalizado para el control de acceso
# Permite la entrada a los usuarios con permiso de admin

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user or not user.is_admin:
            return jsonify({"message": "Acceso denegado: Se requiere ser administrador"}), 403 # Se niega autorización
        # Pasamos el objeto user al wrapped function, xq que lo necesitan las rutas POST/PUT/DELETE
        return fn(user, *args, **kwargs)
    return wrapper


