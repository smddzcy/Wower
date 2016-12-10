class CreateLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :logs do |t|
      t.string :ip_address
      t.text :machine_info
      t.time :time

      t.timestamps
    end
  end
end
