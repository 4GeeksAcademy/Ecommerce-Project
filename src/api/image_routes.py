from flask import Blueprint, request, jsonify
import cloudinary.uploader
from api.models import ProductImage

# rutas img

# Definir blueprint

image_bp = Blueprint('image_bp', __name__)

# Ruta para listar imágenes

@image_bp.route('/', methods=['GET'])
def image():

    images = ProductImage.query.all()

    images = [item.serialize() for item in image]

    return jsonify({
        "images": images
    }), 200

# Ruta para subir imágenes

@image_bp.route('/image/upload', methods=['POST']) 
def upload_image():

#capturo la descripción

    is_main = request.form.get('is_main', False)

    product_id = request.form.get('product_id')

    if 'image' not in request.files:
        return jsonify({"error": "no se envio ninguna imagen"}), 400

    image = request.files['image']

    try:
        
        result = cloudinary.uploader.upload(image, folder="project")

        item = ProductImage()
        item.product_id=product_id
        item.is_main=bool(is_main)
        item.url= result['secure_url'] 
        item.public_id = result['public_id']
        item.save()

        return jsonify({"status": "success", "path_image": result['secure_url'], "public_id": result['public_id']}), 200
        
    except Exception as e:
        return jsonify({ "error": str(e)}), 500

# Ruta para eliminar imagen


@image_bp.route('/image/<int:id>/delete', methods=['DELETE'])
def delete_image(id):

    try:

        item = ProductImage.query.get(id)

        if not item:
            return jsonify({"error": "Imagen no ha sido encontrada"}), 404

        cloudinary.uploader.destroy(item.public_id)
        item.delete()

        return jsonify({"status": "success", "message": "Imagen ha sido eliminada"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
