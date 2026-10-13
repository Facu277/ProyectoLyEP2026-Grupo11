const { validarDatosCliente } = require("../middleware/validateCliente");

// ---------- Helpers ----------

function crearRes() {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

// Cliente que cumple todas las reglas del validador
function clienteValido() {
  return {
    email: "ana@test.com",
    username: "ana",
    password: "Clave1234!",
    phone: "3884123456",
    is_active: true,
    name: { firstname: "Ana", lastname: "Paz" },
    address: {
      city: "Jujuy",
      street: "Belgrano",
      number: 123,
      zipcode: "4600",
    },
  };
}

// Devuelve un cliente válido con una modificación puntual
function conCambios(modificar) {
  const cliente = clienteValido();
  modificar(cliente);
  return cliente;
}

// Ejecuta el middleware y devuelve lo que pasó
function ejecutar(body) {
  const res = crearRes();
  const next = jest.fn();
  validarDatosCliente({ body }, res, next);
  const respuesta = res.json.mock.calls[0]?.[0];
  return { res, next, respuesta, detalles: respuesta?.detalles };
}

const MSG = {
  telefonoObligatorio: "El teléfono es obligatorio.",
  telefonoFormato: "El teléfono debe contener entre 7 y 15 números.",
  passwordObligatoria: "La contraseña es obligatoria.",
  passwordReglas:
    "La contraseña debe tener entre 8 y 20 caracteres e incluir mayúscula, minúscula, número y símbolo, sin espacios.",
  ciudadObligatoria: "La ciudad es obligatoria.",
  ciudadLargo: "La ciudad debe tener entre 2 y 80 caracteres.",
  calleObligatoria: "La calle es obligatoria.",
  calleLargo: "La calle debe tener entre 2 y 100 caracteres.",
  numero: "El número debe ser un entero entre 1 y 999999.",
  zipObligatorio: "El código postal es obligatorio.",
  zipLargo: "El código postal debe tener entre 3 y 12 caracteres.",
  apellidoObligatorio: "El apellido es obligatorio.",
  apellidoLargo: "El apellido debe tener entre 2 y 50 caracteres.",
  apellidoCaracteres: "El apellido contiene caracteres no permitidos.",
  nombreCaracteres: "El nombre contiene caracteres no permitidos.",
  isActive: "is_active debe ser booleano.",
};

// ---------- Tests ----------

describe("validarDatosCliente", () => {
  describe("cliente válido", () => {
    test("llama a next() y no responde con error", () => {
      const { res, next } = ejecutar(clienteValido());

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });

    test("acepta nombres con acentos, espacios y apóstrofes", () => {
      const body = conCambios((c) => {
        c.name.lastname = "O'Connor";
      });
      const { next } = ejecutar(body);

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("acepta is_active booleano (true o false)", () => {
      expect(ejecutar(conCambios((c) => { c.is_active = true; })).next).toHaveBeenCalled();
      expect(ejecutar(conCambios((c) => { c.is_active = false; })).next).toHaveBeenCalled();
    });

    test("deja pasar un cliente sin is_active (origen del Error 7: el modelo lo exige después)", () => {
      const body = conCambios((c) => {
        delete c.is_active;
      });
      const { next, res } = ejecutar(body);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("respuesta de error", () => {
    test("responde 400 con el mensaje general y la lista de detalles", () => {
      const { res, respuesta, next } = ejecutar({});

      expect(res.status).toHaveBeenCalledWith(400);
      expect(respuesta.error).toBe("Datos de cliente inválidos");
      expect(Array.isArray(respuesta.detalles)).toBe(true);
      expect(next).not.toHaveBeenCalled();
    });

    test("con body vacío informa los campos obligatorios", () => {
      const { detalles } = ejecutar({});

      expect(detalles).toEqual(
        expect.arrayContaining([
          MSG.telefonoObligatorio,
          MSG.passwordObligatoria,
          MSG.ciudadObligatoria,
          MSG.calleObligatoria,
          MSG.numero,
          MSG.zipObligatorio,
        ])
      );
    });
  });

  describe("email, username y nombre", () => {
    test("rechaza un email sin @", () => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { c.email = "valtest.com"; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles.length).toBeGreaterThan(0);
    });

    test("rechaza un cliente sin email", () => {
      const { res } = ejecutar(conCambios((c) => { delete c.email; }));

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("rechaza un cliente sin username", () => {
      const { res } = ejecutar(conCambios((c) => { delete c.username; }));

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test("rechaza un cliente sin nombre", () => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { delete c.name.firstname; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles).toEqual(
        expect.arrayContaining([expect.stringMatching(/nombre/i)])
      );
    });

    test("rechaza un nombre con números", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.name.firstname = "Ana1"; })
      );

      expect(detalles).toContain(MSG.nombreCaracteres);
    });

    test("rechaza un cliente sin apellido", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { delete c.name.lastname; })
      );

      expect(detalles).toContain(MSG.apellidoObligatorio);
    });

    test("rechaza un apellido demasiado corto", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.name.lastname = "P"; })
      );

      expect(detalles).toContain(MSG.apellidoLargo);
    });

    test("rechaza un apellido con números", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.name.lastname = "Paz3"; })
      );

      expect(detalles).toContain(MSG.apellidoCaracteres);
    });
  });

  describe("teléfono (7 a 15 dígitos)", () => {
    test("rechaza un cliente sin teléfono", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { delete c.phone; })
      );

      expect(detalles).toContain(MSG.telefonoObligatorio);
    });

    test.each([
      ["con letras (largo válido)", "38841234ab"],
      ["con 6 dígitos", "123456"],
      ["con 16 dígitos", "1234567890123456"],
    ])("rechaza un teléfono %s", (_descripcion, telefono) => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { c.phone = telefono; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles).toContain(MSG.telefonoFormato);
    });

    test.each([
      ["7 dígitos (mínimo)", "1234567"],
      ["15 dígitos (máximo)", "123456789012345"],
      ["con guiones y espacios", "388-412 3456"],
    ])("acepta un teléfono %s", (_descripcion, telefono) => {
      const { next } = ejecutar(conCambios((c) => { c.phone = telefono; }));

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("contraseña (8 a 20, mayúscula, minúscula, número y símbolo, sin espacios)", () => {
    test("rechaza un cliente sin contraseña", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { delete c.password; })
      );

      expect(detalles).toContain(MSG.passwordObligatoria);
    });

    test.each([
      ["sin mayúscula", "clave1234!"],
      ["sin minúscula", "CLAVE1234!"],
      ["sin número", "Clavecita!"],
      ["sin símbolo", "Clave12345"],
      ["con espacios", "Clave 1234!"],
      ["demasiado corta (7)", "Cl1234!"],
      ["demasiado larga (21)", "Clave1234!Clave1234!x"],
    ])("rechaza una contraseña %s", (_descripcion, password) => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { c.password = password; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles).toContain(MSG.passwordReglas);
    });
  });

  describe("dirección", () => {
    test("rechaza un cliente sin ciudad", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { delete c.address.city; })
      );

      expect(detalles).toContain(MSG.ciudadObligatoria);
    });

    test("rechaza una ciudad de un solo carácter", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.address.city = "J"; })
      );

      expect(detalles).toContain(MSG.ciudadLargo);
    });

    test("rechaza un cliente sin calle", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { delete c.address.street; })
      );

      expect(detalles).toContain(MSG.calleObligatoria);
    });

    test("rechaza una calle de un solo carácter", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.address.street = "B"; })
      );

      expect(detalles).toContain(MSG.calleLargo);
    });

    test.each([
      ["0", 0],
      ["1000000 (sobre el máximo)", 1000000],
      ["decimal", 12.5],
      ["texto", "abc"],
      ["ausente", undefined],
    ])("rechaza un número de calle %s", (_descripcion, numero) => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { c.address.number = numero; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles).toContain(MSG.numero);
    });

    test.each([
      ["1 (mínimo)", 1],
      ["999999 (máximo)", 999999],
    ])("acepta un número de calle %s", (_descripcion, numero) => {
      const { next } = ejecutar(
        conCambios((c) => { c.address.number = numero; })
      );

      expect(next).toHaveBeenCalledTimes(1);
    });

    test("rechaza un código postal vacío", () => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.address.zipcode = ""; })
      );

      expect(detalles).toContain(MSG.zipObligatorio);
    });

    test.each([
      ["de 2 caracteres", "46"],
      ["de 13 caracteres", "1234567890123"],
    ])("rechaza un código postal %s", (_descripcion, zipcode) => {
      const { detalles } = ejecutar(
        conCambios((c) => { c.address.zipcode = zipcode; })
      );

      expect(detalles).toContain(MSG.zipLargo);
    });

    test.each([
      ["de 3 caracteres (mínimo)", "460"],
      ["de 12 caracteres (máximo)", "123456789012"],
    ])("acepta un código postal %s", (_descripcion, zipcode) => {
      const { next } = ejecutar(
        conCambios((c) => { c.address.zipcode = zipcode; })
      );

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("is_active", () => {
    test("rechaza un is_active que no es booleano", () => {
      const { res, detalles } = ejecutar(
        conCambios((c) => { c.is_active = "si"; })
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(detalles).toContain(MSG.isActive);
    });
  });

  describe("acumulación de errores", () => {
    test("informa varios errores a la vez", () => {
      const { detalles } = ejecutar(
        conCambios((c) => {
          c.phone = "123";
          c.password = "corta";
          c.address.number = 0;
        })
      );

      expect(detalles).toEqual(
        expect.arrayContaining([MSG.telefonoFormato, MSG.passwordReglas, MSG.numero])
      );
    });
  });
});