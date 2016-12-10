class UfilesController < ApplicationController
  before_action :set_ufile, only: [:show, :update, :destroy]

  # GET /ufiles
  def index
    @ufiles = Ufile.all

    render json: @ufiles
  end

  # GET /ufiles/1
  def show
    render json: @ufile
  end

  # POST /ufiles
  def create
    @ufile = Ufile.new(ufile_params)

    if @ufile.save
      render json: @ufile, status: :created, location: @ufile
    else
      render json: @ufile.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /ufiles/1
  def update
    if @ufile.update(ufile_params)
      render json: @ufile
    else
      render json: @ufile.errors, status: :unprocessable_entity
    end
  end

  # DELETE /ufiles/1
  def destroy
    @ufile.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_ufile
      @ufile = Ufile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def ufile_params
      params.require(:ufile).permit(:name, :path)
    end
end
