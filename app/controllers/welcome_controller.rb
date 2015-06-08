class WelcomeController < ApplicationController

  def index
    # weather = Weather.new
    # if params[:location] == nil
    #   @location = "Denver, CO"
    # else
    #   @location = params[:location]
    # end
    # @info = weather.five_day
    @markers = Marker.all
  end

  def show
    @markers = Marker.all
  end

  def new
    @marker = Marker.new
  end

  def create
    @marker = Marker.new(marker_params)
    if @marker.save
      render json: @marker.to_json
    else
      render :new
    end
  end

  def destroy
    @marker = Marker.find_by(params[:id])
    @marker.destroy
    render nothing: true
  end

private

  def marker_params
    params.require(:marker).permit(:name, :difficulty, :riskiness, :description, :lat, :lng)
  end

end
