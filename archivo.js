const bcrypt = require("bcrypt");

(async () => {
  const hash = await bcrypt.hash("123456", 10);
  console.log(hash);

  const test = await bcrypt.compare("123456", hash);
  console.log("Comparación prueba:", test);
})();