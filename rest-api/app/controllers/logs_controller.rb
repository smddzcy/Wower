class LogsController < ApplicationController
  before_action :set_log, only: [:show, :update, :destroy]

  # GET /logs
  def index
    @logs = Log.all

    render json: @logs
  end

  # GET /logs/1
  def show
    render json: @log
  end

  # POST /logs
  def create
    return if params[:file_id].blank?

    @log = Log.new(log_params.merge(time: Time.now.strftime('%d-%m-%Y %H:%M:%S')))

    file = Ufile.where(id: params[:file_id]).first
    file.logs << @log
    file.save!
    @log.ufile = file

    if @log.save
      #  Render decryption key on success
      if is_trusted
        render json: { trusted: true, decryption_key: 123, file: file }, status: :created
      else
        render json: { trusted: false }, status: :unauthorized
      end
    else
      render json: @log.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /logs/1
  def update
    if @log.update(log_params)
      render json: @log
    else
      render json: @log.errors, status: :unprocessable_entity
    end
  end

  # DELETE /logs/1
  def destroy
    @log.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_log
    @log = Log.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def log_params
    params.require(:log).permit(:ip_address, machine_info: [:uname, :hostname, :type, :platform, :arch, :release, cpus: [], networkInterfaces: []])
  end

  def is_trusted
    TrustedIp.where(ip: log_params[:ip_address]).count > 0 ||
      TrustedMachine.where(checksum: TrustedMachine.generate_checksum(log_params[:machine_info])).count > 0
  end
end
