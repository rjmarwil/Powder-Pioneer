class WelcomeController < ApplicationController

  def index
    weather = Weather.new
    if params[:location] == nil
      @location = "Denver, CO"
    else
      @location = params[:location]
    end
    # @info = weather.five_day
  end

end
