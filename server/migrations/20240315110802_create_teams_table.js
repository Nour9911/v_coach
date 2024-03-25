const bcrypt = require('bcrypt');

exports.up = function(knex) {
  const saltRounds = 10;
  const plainPassword1 = 'password123';
  const plainPassword2 = 'anotherpassword456';
  
  // Hash the plain passwords
  const hashedPassword1 = bcrypt.hashSync(plainPassword1, saltRounds);
  const hashedPassword2 = bcrypt.hashSync(plainPassword2, saltRounds);

  // Use knex.raw to execute raw SQL queries for insertion
  return knex.schema.createTable('teams', function(table) {
    table.increments('id').primary();
    table.string('team_name').nullable();
    table.string('password').nullable();
    table.string('class').nullable();
    table.date('date').nullable().defaultTo(knex.fn.now());;
    table.string('country').nullable();
    table.string('continent').nullable();
  })
  .then(() => {
    // Use knex.raw to execute raw SQL queries for insertion
    return knex.raw(`
        INSERT INTO teams (team_name, password, class, date, country, continent)
      VALUES 
        ('psg', '${hashedPassword1}', 'A', CURRENT_DATE, 'France', 'Europe'),
        ('realmadrid', '${hashedPassword2}', 'B', CURRENT_DATE, 'Spain', 'Europe')
    `);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teams');
};
