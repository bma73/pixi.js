import { Resource } from 'resource-loader';
import path from 'path';
<<<<<<< HEAD
import * as core from '../core';
import Loader from './loader';

const BATCH_SIZE = 1000;
=======
import { Spritesheet } from '../core';
>>>>>>> a2fe8d01d2dd713d6940207cb9e846f77ec4e890

export default function ()
{
    return function spritesheetParser(resource, next)
    {
        let resourcePath;
        const imageResourceName = `${resource.name}_image`;

        // skip if no data, its not json, it isn't spritesheet data, or the image resource already exists
        if (!resource.data
            || resource.type !== Resource.TYPE.JSON
            || !resource.data.frames
            || this.resources[imageResourceName]
        )
        {
            next();

            return;
        }

        const loadOptions = {
            crossOrigin: resource.crossOrigin,
            loadType: Resource.LOAD_TYPE.IMAGE,
            metadata: resource.metadata.imageMetadata,
            parentResource: resource,
        };

        // Prepend url path unless the resource image is a data url
        if (resource.isDataUrl)
        {
            resourcePath = resource.data.meta.image;
        }
        else
        {
            let noCache = '';

            if (Loader.spritesheetNoCache !== null) noCache = `?${Loader.spritesheetNoCache}`;
            resourcePath = `${path.dirname(resource.url.replace(this.baseUrl, ''))}/${resource.data.meta.image}${noCache}`;
        }

        // load the image for this sheet
        this.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res)
        {
            const spritesheet = new Spritesheet(
                res.texture.baseTexture,
                resource.data,
                resource.url
            );

            spritesheet.parse(() =>
            {
                resource.spritesheet = spritesheet;
                resource.textures = spritesheet.textures;
                next();
            });
        });
    };
}
