exports.up = function(knex) {
  return knex.schema.createTable('teams', function(table) {
    table.increments('id').primary();
    table.string('team_name').nullable();
    table.string('password').nullable();
    table.string('class').nullable();
    table.date('date').nullable().defaultTo(knex.fn.now());
    table.string('country').nullable();
    table.string('continent').nullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teams');
};
