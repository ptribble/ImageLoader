/*
The MIT License

Copyright (c) 2011 Matthew Wilcoxson (www.akademy.co.uk)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/*
ImageLoader
By Matthew Wilcoxson

Description:    Download image files when you need them.
Example:        http://www.akademy.co.uk/software/canvaszoom/canvaszoom.php
Version:        1.0.2
*/
function ImageLoader( settings )
{
	// Constructor
	var thatImageLoader = this;
	
	var checkComplete, complete;
	
	this.imageCount = settings.images.length;
	this.images = new Array( this.imageCount );
	
	this.begun = false;
	
	this.onAllLoaded = null;
	if( settings.onAllLoaded != undefined )
		this.onAllLoaded = settings.onAllLoaded;
	
	this.onImageLoaded = null;
	if( settings.onImageLoaded != undefined )
		this.onImageLoaded = settings.onImageLoaded;
	
	for( i = 0; i < this.imageCount; i++ )
	{
		var name = '';
		var id = 0;
		
		if( settings.images[i].name != undefined )
			name = settings.images[i].name;
		if( settings.images[i].id != undefined )
			id = settings.images[i].id;
			
		this.images[i] = new LoadImage( name, id, i, settings.images[i].file );
	}
	
	this.begun = true;
	
	this.getImageByPosition = function( position ) {
		for( i = 0; i < this.imageCount; i++ )
			if( position == this.images[i].position )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded
	
		return undefined; // Not found
	};	
	
	this.getImageById = function( id ) {
		for( i = 0; i < this.imageCount; i++ )
			if( id == this.images[i].id )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded
	
		return undefined; // Not found
	};
	
	this.getImageByName = function( name ) {
		for( i = 0; i < this.imageCount; i++ )
			if( name == this.images[i].name )
				if( this.images[i].loaded )
					return this.images[i].image;
				else
					return null; // Not loaded
	
		return undefined; // Not found
	};
	
	this.loadedIds = function ( idArray ) {
		if( this.begun )
		{
			for( j = 0; j < idArray.length; j++ )
				for( i = 0; i < this.imageCount; i++ )
					if( idArray[j] == this.images[i].id )
						if( this.images[i].loaded == false )
							return false;
								
			return true;
		}
		
		return false;
	};
	
	this.loadedNames = function ( nameArray ) {
		if( this.begun )
		{
			for( j = 0; j < nameArray.length; j++ )
				for( i = 0; i < this.imageCount; i++ )
					if( nameArray[j] == this.images[i].name )
						if( this.images[i].loaded == false )
							return false;
								
			return true;
		}
		
		return false;
	};
	
	this.loadedAll = function() {
		if( this.begun )
		{
			for( i = 0; i < this.imageCount; i++ )
				if( this.images[i].loaded == false )
					return false;
			
			return true;
		}
		
		return false;
	};
	
	var setLoaded = function( position ) {
		for( i = 0; i < thatImageLoader.imageCount; i++ )
			if( position == thatImageLoader.images[i].position )
			{
				thatImageLoader.images[i].Done();
				if( thatImageLoader.onImageLoaded != null )
					thatImageLoader.onImageLoaded( thatImageLoader.images[i].name, thatImageLoader.images[i].image );
			}
	
		checkComplete();
	};
	
	checkComplete = function() {
		for( i = 0; i < thatImageLoader.imageCount; i++ )
			if( !thatImageLoader.images[i].loaded )
				return;
		
		complete();
	};
	
	complete = function() {
		if( thatImageLoader.onAllLoaded != null )
			thatImageLoader.onAllLoaded();
	};
	
	function LoadImage( name, id, position, file )
	{
		var thatLoadImage = this;
		
		this.name = name;
		this.id = id;
		this.position = position;
		this.file = file;
		this.loaded = false;
		
		this.image = new Image();
		this.image.onload = function() { setLoaded( thatLoadImage.position ); };

		this.image.src = this.file; // Set last.
		
		this.Done = function () {
			thatLoadImage.loaded = true;
			thatLoadImage.image.onload = thatLoadImage.image.onabort = thatLoadImage.image.onerror = null;
		};
	};
}
