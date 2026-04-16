exports.up = function(knex) {
  return knex.schema
    // Users table
    .createTable('users', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.string('firebase_uid', 128).unique().notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('display_name', 255);
      table.text('avatar_url');
      table.boolean('is_premium').defaultTo(false);
      table.datetime('premium_until');
      table.boolean('is_expert').defaultTo(false);
      table.datetime('created_at').defaultTo(knex.fn.now());
    })
    // Products table
    .createTable('products', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.string('barcode', 50).unique();
      table.string('name', 255).notNullable();
      table.string('brand', 255);
      table.string('category', 100);
      table.text('image_url');
      table.json('ingredients'); // SQLite supports JSON functions
      table.decimal('truth_score', 4, 2);
      table.decimal('carbon_score', 4, 2);
      table.decimal('water_score', 4, 2);
      table.decimal('toxicity_score', 4, 2);
      table.integer('score_version').defaultTo(1);
      table.datetime('score_updated_at');
      table.json('raw_off_data');
      table.datetime('created_at').defaultTo(knex.fn.now());
      table.datetime('updated_at').defaultTo(knex.fn.now());
    })
    // Scans table
    .createTable('scans', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
      table.string('scan_method', 20); // 'barcode', 'ocr', 'manual'
      table.text('scan_input');
      table.datetime('scanned_at').defaultTo(knex.fn.now());
      table.index('user_id');
      table.index('product_id');
    })
    // Alternatives table
    .createTable('alternatives', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('source_product_id').references('id').inTable('products').onDelete('CASCADE');
      table.uuid('alt_product_id').references('id').inTable('products').onDelete('CASCADE');
      table.decimal('score_delta', 4, 2);
      table.decimal('price_delta_pct', 6, 2);
      table.datetime('created_at').defaultTo(knex.fn.now());
      table.index('source_product_id');
    })
    // Experts table
    .createTable('experts', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('user_id').references('id').inTable('users').unique().onDelete('CASCADE');
      table.text('bio');
      table.json('credentials');
      table.json('specializations'); // SQLite needs JSON for array
      table.integer('consultation_fee').defaultTo(4900); // In paise
      table.boolean('is_verified').defaultTo(false);
      table.datetime('verified_at');
      table.decimal('rating_avg', 3, 2);
      table.integer('rating_count').defaultTo(0);
      table.datetime('created_at').defaultTo(knex.fn.now());
    })
    // Consultations table
    .createTable('consultations', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('consumer_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('expert_id').references('id').inTable('experts').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('SET NULL');
      table.string('status', 20).defaultTo('pending');
      table.json('consumer_filters');
      table.text('expert_response');
      table.string('payment_intent', 255);
      table.integer('amount_paise');
      table.integer('expert_payout');
      table.datetime('created_at').defaultTo(knex.fn.now());
      table.datetime('responded_at');
      table.index('consumer_id');
      table.index('expert_id');
    })
    // Reviews
    .createTable('reviews', table => {
      table.uuid('id').primary().defaultTo(knex.fn.uuid());
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
      table.integer('score_accuracy');
      table.text('comment');
      table.datetime('created_at').defaultTo(knex.fn.now());
    })
    // Wishlist
    .createTable('wishlist', table => {
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('product_id').references('id').inTable('products').onDelete('CASCADE');
      table.datetime('added_at').defaultTo(knex.fn.now());
      table.primary(['user_id', 'product_id']);
    })
    // Impact Stats
    .createTable('impact_stats', table => {
      table.uuid('user_id').primary().references('id').inTable('users').onDelete('CASCADE');
      table.decimal('co2_saved_kg', 12, 4).defaultTo(0);
      table.decimal('plastic_avoided_kg', 12, 4).defaultTo(0);
      table.decimal('water_saved_litres', 12, 4).defaultTo(0);
      table.integer('products_switched').defaultTo(0);
      table.datetime('last_updated').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('impact_stats')
    .dropTableIfExists('wishlist')
    .dropTableIfExists('reviews')
    .dropTableIfExists('consultations')
    .dropTableIfExists('experts')
    .dropTableIfExists('alternatives')
    .dropTableIfExists('scans')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};
