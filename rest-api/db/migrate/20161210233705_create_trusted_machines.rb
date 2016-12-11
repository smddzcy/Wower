class CreateTrustedMachines < ActiveRecord::Migration[5.0]
  def change
    create_table :trusted_machines do |t|
      t.text :checksum
      t.json :info

      t.timestamps
    end
  end
end
