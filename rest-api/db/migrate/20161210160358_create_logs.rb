class CreateLogs < ActiveRecord::Migration[5.0]
  def change
    create_table :logs do |t|
      t.string :ip_address
      t.json :machine_info
      t.time :time
      t.belongs_to :ufile

      t.timestamps
    end
  end
end
