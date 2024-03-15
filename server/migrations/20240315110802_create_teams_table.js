exports.up = function(knex) {
    return knex.schema.createTable('teams', function(table) {
      table.increments('id').primary();
      table.string('team_name').nullable();
      table.string('password').nullable();
      table.string('nationalclass').nullable();
      table.string('continentclass').nullable();
      table.string('worldclass').nullable();
      // Add any additional columns here
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('teams');
  };
  