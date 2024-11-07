export function generateStudentId() {
  // Les préfixes possibles
  const prefixes = ["AD", "AA", "AC"];

  // Choisir un préfixe aléatoire
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];

  // Générer un numéro aléatoire à 8 chiffres
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);

  // Combiner le préfixe et le numéro pour former l'ID
  return `${prefix}${randomNumber}`;
}
