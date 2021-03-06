@albums.each do |album|
  json.set! album.id do
    json.extract! album, :id, :title, :release_date, :artist_id, :track_ids
    json.artist album.artist, :id, :name
    json.photoUrl url_for(album.photo)
  end
end
