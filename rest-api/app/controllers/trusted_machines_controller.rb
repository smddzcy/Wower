class TrustedMachinesController < ApplicationController
  before_action :set_trusted_machine, only: [:show, :update, :destroy]

  # GET /trusted_machines
  def index
    @trusted_machines = TrustedMachine.all

    render json: @trusted_machines
  end

  # GET /trusted_machines/1
  def show
    render json: @trusted_machine
  end

  # POST /trusted_machines
  def create
    @trusted_machine = TrustedMachine.new(trusted_machine_params)

    if @trusted_machine.save
      render json: @trusted_machine, status: :created, location: @trusted_machine
    else
      render json: @trusted_machine.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /trusted_machines/1
  def update
    if @trusted_machine.update(trusted_machine_params)
      render json: @trusted_machine
    else
      render json: @trusted_machine.errors, status: :unprocessable_entity
    end
  end

  # DELETE /trusted_machines/1
  def destroy
    @trusted_machine.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_trusted_machine
    @trusted_machine = TrustedMachine.find(params[:id])
    @trusted_machine = TrustedMachine.find(params[:checksum]) if @trusted_machine.blank?
  end

  # Only allow a trusted parameter "white list" through.
  def trusted_machine_params
    params.require(:trusted_machine).permit(info: [:uname, :hostname, :type, :platform, :arch, :release, cpus: [], networkInterfaces: []])
  end
end
