class CreateUfiles < ActiveRecord::Migration[5.0]
  def change
    create_table :ufiles do |t|
      t.string :name
      t.string :path
      t.text :data

      t.timestamps
    end
  end
end
