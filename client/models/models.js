import { SECTORES } from '../shared/validaciones.js';

// ==========================================
// MODELO BASE: USUARIO
// ==========================================

export class Usuario {

  // La contraseña se mantiene privada dentro de la clase.
  #password;

  constructor({
    id,
    email,
    username,
    password,
    name,
    phone,
    is_active = true
  }) {

    // Validamos solamente que is_active sea booleano.
    if (typeof is_active !== 'boolean') {
      throw new TypeError('is_active debe ser booleano');
    }

    // Datos públicos del usuario.
    this.id = id;
    this.email = email;
    this.username = username;
    this.name = { ...name };
    this.phone = phone;
    this.is_active = is_active;

    // Se guarda la contraseña tal como llega.
    // No se realiza encriptación ni validación bcrypt.
    this.#password = password;
  }

  // Permite obtener la contraseña para almacenarla.
  passwordForStorage() {
    return this.#password;
  }

  // Convierte el usuario a un objeto JSON.
  // La contraseña NO se devuelve por seguridad.
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      name: this.name,
      phone: this.phone,
      is_active: this.is_active
    };
  }
}










// ==========================================
// CLIENTE
// ==========================================

export class Cliente extends Usuario {

  constructor(data) {

    // Inicializamos los atributos heredados de Usuario.
    super(data);

    const {
      city,
      street,
      number,
      zipcode
    } = data.address;

    // Dirección específica de los clientes.
    this.address = {
      city,
      street,
      number,
      zipcode
    };
  }

  // Agregamos el tipo de usuario y su dirección.
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: 'CLIENTE',
      address: this.address
    };
  }
}



// ==========================================
// ADMINISTRADOR
// ==========================================

export class Administrador extends Usuario {

  #sector;

  constructor(data) {

    // Inicializamos los atributos heredados de Usuario.
    super(data);

    // El administrador posee un sector.
    // Ejemplo: GERENTE o SOPORTE.
    if (!SECTORES.includes(data.sector)) throw new TypeError('Sector inválido');
    this.#sector = data.sector;
  }

  // Getter para consultar el sector.
  get sector() {
    return this.#sector;
  }

  // Agregamos el tipo y sector del administrador.
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: 'ADMINISTRADOR',
      sector: this.#sector
    };
  }
}



















