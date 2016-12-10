class Log < ApplicationRecord
  serialize :machine_info, JSON

  belongs_to :ufile, optional: true
end
