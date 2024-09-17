class MarvelService {
  _apiBase = "https://gateway.marvel.com:443/v1/public/";
  _apiKey = "apikey=f0e4afac6968f9af0a32fda8b96fcf1a";
  _baseOffset = 210;

  getResourse = async (url) => {
    console.log("Fetching", url);
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    } else {
      console.log("Success");
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._baseOffset) => {
    const res = await this.getResourse(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`
    );
    return {
      data: res.data.results.map(this._transformCharacter),
      total: res.data.total,
    };
  };

  getCharacter = async (id) => {
    const res = await this.getResourse(
      `${this._apiBase}characters/${id}?${this._apiKey}`
    );
    return this._transformCharacter(res.data.results[0]);
  };

  _transformCharacter = (char) => {
    let helpDescription = char.description
      ? char.description
      : "There is no description for this character";
    helpDescription =
      helpDescription.length > 210
        ? helpDescription.slice(0, 210) + "..."
        : helpDescription;

    return {
      id: char.id,
      name: char.name,
      description: helpDescription,
      comics: char.comics.items,
      thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  };
}

export default MarvelService;
