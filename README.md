# Gallery
A static site generator for your photo albums. A 🤑free🤑 Squarespace alternative for your photos. Live demo at http://andyzhang.net

## Requirements
5 minutes of your time and photos📸 you love 🎉! (+ git and python)

## Making your own gallery in less than 5 minutes
1. Fork this repository🍴
2. Clone the repository through terminal by running 
`git clone git@github.com:{YOUR_USERNAME}/gallery.git`
3. Import all of your albums into the `/photos` directory. For each of your albums, create a folder with the same name as your album name, and then put all of your photos in the folder. Example:
```
/photos
  /travel
    IMG_0123.jpg
    IMG_0124.jpg
  /portrait
    IMG_1234.jpg
    IMG_1235.jpg
```

4. Open the folder in finder and double click `setup.command`. This will go through all of your albums and create a `config.json` file for you. This file allows the generator to know which photos will be hosted on your website.✨
5. Replace the name in `index.html` to be your name. Feel free to make any other changes here!
6. Commit all of your changes and then push all of your changes to Github by running
```
$ git checkout -B gh-pages  # This creates a branch that will be hosted at {username}.github.io/gallery
$ git commit -am "Create my first gallery"  # This saves all of your changes
$ git push origin gh-pages  # This pushes your gallery to be hosted!
```
7. Check out your site at {username}.github.io/gallery 🎉✨!

*Notes: To ⏭speed⏭ up the loading time of your gallery, please make sure to compress your images*

## How It Works
There are two important pieces to gallery:

### Album Generation
`setup.command` goes through all of the folders in your `/photos/` directory. It collects all of the file paths of each photo in each album. It aggregates all of this data into one key file called `config.json`.

### Client-side Generation
Once you've created your `config.json`, the website can now use that file to figure out which photos to show. It uses JavaScript(ES6🔥!) to layout your photos, grouping all of the photos per album.

## Fun Facts
- No jQuery is used. AT ALL! 🔥🔥🔥
- No Bootstrap is used. AT ALL! 🔥🔥🔥
- It uses ES6. NEW TECH! 🔥🔥🔥
- It has no local dependencies. SAY WHAT! 🔥🔥🔥
🔥🔥🔥

## Customizing your Gallery
Gallery supports 3 different kinds of layouts: rows, squares and columns. You can choose which type of layout you want to use by setting the `layout` variable in `script.js` to be either `SQUARES`, `ROWS` or `COLUMNS`.

Each different layout has both its own and shared set of configuration options.

### Shared
`spacing` (Integer): The vertical and horizontal distance that separates each photo from all adjacent photos.
`shuffle` (Boolean): Toggle to shuffle or not to shuffle the photos.

### Column Configuration
`columns` (Integer): The number of columns for the layout.

### Square Configuration
`columns` (Integer): The number of columns for the layout.
`maxHeight` (Integer): The max height in px for each photo.
Columns takes priority if both are set.

### Row Configuration
`maxHeight` (Integer): The max height in px for each photo.
