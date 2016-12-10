class LogBelongsToFile < ActiveRecord::Migration[5.0]
  def change
    add_index :logs, :ufile_id
    add_foreign_key :logs, :ufiles
  end
end
