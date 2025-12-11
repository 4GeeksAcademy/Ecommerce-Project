"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from datetime import datetime
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

auth = Blueprint('auth', __name__)

# Allow CORS requests to this API
CORS(auth)


@auth.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

####### Rutas de la API #########

## Registro

@auth.route("/register", methods=["POST"])
def register():
    # Capturar datos de registro de usuario
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    last_name = data.get("last_name")

    # Validar datos recibidos
    if not email or not password:
        return jsonify({"message": "Email y contraseña son requeridos"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "El usuario ya existe"}), 409

    # Crear usuario y setear contraseña
    new_user = User(email=email, name=name, last_name=last_name, is_active=True) 
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Usuario creado exitosamente", "user": new_user.serialize()}), 201 # se debe redirigir al login

## Login

@auth.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"msg": "Credenciales inválidas"}), 401
    
    # Crear token de acceso y expiración
    expires = datetime.timedelta(days=10)
    access_token = create_access_token(identity=str(user.id), expires_delta=expires)

    datos = {
        "msg": "Inicio de sesión exitoso", 
        "access_token": access_token,
        "user": user.serialize()
    }

    return jsonify({"datos": datos}), 200


## Ingresar a mi cuenta => Profile

@auth.route("/profile", methods=["GET"])
@jwt_required() # con esto protegemos la ruta 
def get_user_profile():
    # 1. Obtener el user_id del token JWT
    user_id = get_jwt_identity()
    # 2. Buscar usuario en base de datos
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    return jsonify(user.serialize()), 200


## Actualizar mi perfil

@auth.route("/profile", methods=["PUT"])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity() # con esto obtengo el id del usuario del token
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    data = request.get_json() or {}

    user.name = data.get("name", user.name)
    user.last_name = data.get("last_name", user.address)
    user.address = data.get("address", user.address)
    user.email = data.get("email", user.email) 

    try:
        db.session.commit()
        return jsonify({"msg": "Perfil actualizado", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar perfil", "error": str(e)}), 500
    

## Cambiar contraseña

@auth.route("/password", methods=["PUT"])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
        
    data = request.get_json() or {}
    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"message": "Se requieren ambas contraseñas"}), 400

    # 1. validar contraseña antigua
    if not user.check_password(old_password):
        return jsonify({"message": "Contraseña antigua incorrecta"}), 401

    # 2. guardar la nueva contraseña
    user.set_password(new_password)
    db.session.commit()

    return jsonify({"message": "Contraseña actualizada exitosamente"}), 200

## Eliminar o desactivar usuario

@auth.route("/profile", methods=["DELETE"])
@jwt_required()
def delete_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    # Desactivamos al usuario
    user.is_active = False
    

    try:
        db.session.commit()
        # Enviar respuesta y luego revocar el token si usas JWT Blacklisting
        return jsonify({"msg": "Cuenta desactivada exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al desactivar la cuenta", "error": str(e)}), 500
