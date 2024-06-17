import React from 'react';
import SliderGradientCard from 'components/custom/SliderGradientCard';

import { StringDateToFormat, TextSlicer } from 'helpers'

const EntriesCards = ({entries,className}) => {

    let entriesFiltered = []
	entries.forEach( entry => {
		if(entry.active) { 
			entriesFiltered.push(entry)
		}
	});
    return (
        <div className={className}>
            <div className="grid grid-cols-3 gap-4">
            {
                entriesFiltered.map( entry => {

                    const date = entry.date_start === entry.date_end || !entry.date_end ?  StringDateToFormat(entry.date_start) : StringDateToFormat(entry.date_start) +' - '+ StringDateToFormat(entry.date_end)
                    const url = entry.url
                    const img = entry.file_image
                    const Title = () => <h2 className="text-white">{TextSlicer(entry.name,25)}</h2>
                    const Subtitle = () => <h6 className="text-white">{date}</h6>

                    return <SliderGradientCard key={entry.name} url={url} img={img} title={ <Title/> } subtitle={<Subtitle/>} />
                })
            }
            </div>
        </div>
    )
}

export default EntriesCards;