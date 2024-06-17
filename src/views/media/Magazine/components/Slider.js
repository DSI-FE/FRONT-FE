import React from "react";

import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

import { StringDateToFormat, TextSlicer } from "helpers";

import SliderGradientCard from "components/custom/SliderGradientCard";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const Slider = ({entries}) => {

	let entriesFiltered = []
	entries.forEach( entry => {
		if(entry.show_in_carousel && entry.active) { 
			entriesFiltered.push(entry)
		}
	});
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const maxSteps = entries.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStepChange = (step) => {
        setActiveStep(step);
    };

	const MobileStepperCustom = () => (
		<MobileStepper
			style={{
				width: "100%",
				position: "absolute",
				bottom: 10,
				left: "50%",
				transform: "translateX(-50%)",
				backgroundColor: 'transparent',
			}}
			steps={0}
			position="static"
			activeStep={activeStep}
			nextButton={
				<Button style={{ color: activeStep === maxSteps - 1 ? 'gray':'white' }} size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} >
				{theme.direction === 'rtl' ? ( <KeyboardArrowLeft /> ) : ( <KeyboardArrowRight /> )}
				</Button>
			}
			backButton={
				<Button style={{ color: activeStep === 0 ? 'gray':'white' }} size="small" onClick={handleBack} disabled={activeStep === 0} >
					{ theme.direction === 'rtl' ? ( <KeyboardArrowRight /> ) : ( <KeyboardArrowLeft /> )} 
				</Button>
			}
		/>
	)

    return (
		<>
			<Box className='border' sx={{ maxWidth: '100%'}}>
				<AutoPlaySwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
    				index={activeStep}
    				onChangeIndex={handleStepChange}
    				enableMouseentries
				>
				{
					entriesFiltered.map( (entry,index) => {
						const date = entry.date_start === entry.date_end || !entry.date_end ?  StringDateToFormat(entry.date_start) : StringDateToFormat(entry.date_start) +' - '+ StringDateToFormat(entry.date_end)
						const url = entry.url
						const img = entry.file_image
						const Title = () => <h2 className="text-white">{TextSlicer(entry.name,30)}</h2>
						const Subtitle = () => <h6 className="text-white">{date}</h6>
						return (
						<div key={entry.name}>
						{
							Math.abs(activeStep - index) <= 2 ? (
								<>
									<SliderGradientCard url={url} img={img} title={ <Title/> } subtitle={<Subtitle/>} footer={<MobileStepperCustom/>}/>
								</>
							) : null

						}
						</div>)
					})
				}
				</AutoPlaySwipeableViews>
			</Box>
		</>
	)
}

export default Slider;