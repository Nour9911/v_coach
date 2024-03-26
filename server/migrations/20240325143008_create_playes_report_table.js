exports.up = function(knex) {
    return knex.schema.createTable('player_report', function(table) {
      table.increments('id').primary();
      table.integer('player_id').unsigned().notNullable();
      table.foreign('player_id').references('id').inTable('players').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('match_id').unsigned().notNullable(); // Foreign key reference to match
      table.foreign('match_id').references('id').inTable('matches').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('position').nullable();
      table.integer('control_pass').nullable();
      table.integer('bad_pass').nullable();
      table.integer('bad_control').nullable();
      table.integer('control_shoot').nullable();
      table.integer('bad_shoot').nullable();
      table.integer('excellent_pass').nullable();
      table.integer('excellent_control').nullable();
      table.integer('excellent_shoot').nullable();
      table.integer('control_and_goal').nullable();
      table.integer('recup_pass').nullable();
      table.integer('discipline').nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());

      // Add a composite unique constraint for player_id and match_id
      table.unique(['player_id', 'match_id']);
      // Add any additional fields as needed
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('report');
  };