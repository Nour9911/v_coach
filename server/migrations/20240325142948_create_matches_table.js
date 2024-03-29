exports.up = async function(knex) {
  await knex.schema.createTable('matches', function(table) {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.string('location').nullable();
    // Foreign key references to both teams
    table.integer('home_team_id').unsigned().nullable();
    table.foreign('home_team_id').references('id').inTable('teams').onDelete('SET NULL').onUpdate('CASCADE');
    table.integer('away_team_id').unsigned().nullable();
    table.foreign('away_team_id').references('id').inTable('teams').onDelete('SET NULL').onUpdate('CASCADE');
  });

  // Execute raw SQL to add the check constraint after creating the table
  await knex.raw('ALTER TABLE matches ADD CONSTRAINT different_teams CHECK (home_team_id <> away_team_id)');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('matches');
};
