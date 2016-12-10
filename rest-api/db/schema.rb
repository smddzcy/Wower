# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161210175454) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "auths", force: :cascade do |t|
    t.json     "trusted_ips"
    t.json     "trusted_machines"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "logs", force: :cascade do |t|
    t.string   "ip_address"
    t.json     "machine_info"
    t.string   "time"
    t.integer  "ufile_id"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["ufile_id"], name: "index_logs_on_ufile_id", using: :btree
  end

  create_table "ufiles", force: :cascade do |t|
    t.string   "name"
    t.string   "path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

end
