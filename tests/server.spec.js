const request = require("supertest");
const app = require("../index");

describe("Operaciones CRUD de cafes", () => {

  // REQ 1 GET /cafes devuelve status 200 y un arreglo con por lo menos 1 objeto

  it("GET /cafes devuelve status 200 y un arreglo con al menos un objeto", async () => {
    const res = await request(app).get("/cafes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(typeof res.body[0]).toBe("object");
  });

  // REQ 2 DELETE /cafes con id inexistente devuelve código 404

  it("DELETE /cafes/:id devuelve 404 si el café con el id no existe", async () => {
    const res = await request(app)
      .delete("/cafes/999")
      .set("Authorization", "token-de-prueba");
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No se encontró ningún cafe con ese id");
  });

  // REQ 3 POST /cafes agrega un nuevo café y devuelve código 201

  it("POST /cafes agrega un nuevo café y devuelve 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Latte" };
    const res = await request(app).post("/cafes").send(nuevoCafe);
    expect(res.statusCode).toBe(201);
    const cafeAgregado = res.body.find((cafe) => cafe.id === nuevoCafe.id);
    expect(cafeAgregado).toBeDefined();
    expect(cafeAgregado.nombre).toBe(nuevoCafe.nombre);
  });

  // REQ 4 PUT /cafes con id de parámetro distinto al id del payload devuelve 400
  
  it("PUT /cafes devuelve 400 si el id del parámetro no coincide con el id del café recibido", async () => {
    const cafeModificado = { id: 2, nombre: "Espresso" };
    const res = await request(app).put("/cafes/1").send(cafeModificado);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "message",
      "El id del parámetro no coincide con el id del café recibido"
    );
  });
});
