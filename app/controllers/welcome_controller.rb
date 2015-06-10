class WelcomeController < ApplicationController

  def index
    # weather = Weather.new
    # if params[:location] == nil
    #   @location = "Denver, CO"
    # else
    #   @location = params[:location]
    # end
    # @info = weather.five_day
  end

  def get_markers
    @markers = Marker.all
    render json: @markers
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
    @lat = params[:marker][:lat]
    @lng = params[:marker][:lng]
    @marker = Marker.find_by(lat: @lat, lng: @lng)
    @marker.destroy
    render nothing: true
  end

private

  def marker_params
    params.require(:marker).permit(:name, :difficulty, :riskiness, :description, :lat, :lng)
  end

end
