exports.up = function(knex) {
    return knex.schema.createTable('players', function(table) {
      table.increments('id').primary();
      table.string('name').nullable();
      table.string('lastname').nullable();
      table.date('birthdate').nullable();
      table.integer('lengh').nullable();
      table.integer('weight').nullable();
      table.integer('speedtest').nullable();
      table.integer('endurancetest').nullable();
      table.integer('team_id').unsigned().nullable(); // Nullable foreign key reference
      table.foreign('team_id').references('id').inTable('teams').onDelete('SET NULL').onUpdate('CASCADE');
      // Add any additional columns here
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('players');
  };
  