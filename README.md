# Proyecto Quick Document AI

## Instalación

Ejecuta el siguiente comando para instalar las dependencias del proyecto:

```bash
npm install
```

## Configuración

Para configurar el servicio de autenticación con Google Cloud, sigue estos pasos:

### 1. Crear una clave de cuenta de servicio

1. Accede a la [Consola de Google Cloud](https://console.cloud.google.com/iam-admin/iam?project=quickdocumentai).
2. En el menú lateral, ve a **IAM & Admin** → **Service Accounts**.
3. Busca la cuenta de servicio **quick-scanner** y haz clic en ella.
4. Dirígete a la pestaña **KEYS** y selecciona **Agregar clave** → **Crear una nueva clave**.
5. Selecciona el formato **JSON** y descarga el archivo.

### 2. Configurar la clave en el proyecto

```bash
# Moverse al directorio del proyecto
cd path-to-project

# Crear la carpeta de configuración si no existe
mkdir -p src/config

# Guardar el archivo descargado en la ruta del proyecto, respetando el nombre de archivo "service-account.json"
src/config/service-account.json

# Exportar la variable de entorno (codigo de linux)
export GOOGLE_APPLICATION_CREDENTIALS="src/config/service-account.json"
```

Con esto, tu proyecto estará listo para autenticarse con Google Cloud. 🚀
