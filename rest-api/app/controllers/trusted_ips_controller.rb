class TrustedIpsController < ApplicationController
  before_action :set_trusted_ip, only: [:show, :update, :destroy]

  # GET /trusted_ips
  def index
    @trusted_ips = TrustedIp.all

    render json: @trusted_ips
  end

  # GET /trusted_ips/1
  def show
    render json: @trusted_ip
  end

  # POST /trusted_ips
  def create
    @trusted_ip = TrustedIp.new(trusted_ip_params)

    if @trusted_ip.save
      render json: @trusted_ip, status: :created, location: @trusted_ip
    else
      render json: @trusted_ip.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /trusted_ips/1
  def update
    if @trusted_ip.update(trusted_ip_params)
      render json: @trusted_ip
    else
      render json: @trusted_ip.errors, status: :unprocessable_entity
    end
  end

  # DELETE /trusted_ips/1
  def destroy
    @trusted_ip.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_trusted_ip
      @trusted_ip = TrustedIp.find(params[:id])
      @trusted_ip = TrustedIp.find(params[:ip]) if @trusted_ip.blank?
    end

    # Only allow a trusted parameter "white list" through.
    def trusted_ip_params
      params.require(:trusted_ip).permit(:ip)
    end
end
