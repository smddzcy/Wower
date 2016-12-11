class CreateTrustedIps < ActiveRecord::Migration[5.0]
  def change
    create_table :trusted_ips do |t|
      t.string :ip

      t.timestamps
    end
  end
end
