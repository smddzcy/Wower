class CreateAuths < ActiveRecord::Migration[5.0]
  def change
    create_table :auths do |t|
      t.json :trusted_ips
      t.json :trusted_machines

      t.timestamps
    end
  end
end
