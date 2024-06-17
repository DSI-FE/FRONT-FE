import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { COM_NAME } from 'constants/app.constant'
import appConfig 	from 'configs/app.config'

const Logo = (props) => {
    const { gutter, className, imgClass, style, logoWidth, src = appConfig.logoSrc } = props

    return (
        <div
            className={classNames('logo', className, gutter)}
            style={{
                ...style,
                ...{ width: logoWidth },
            }}
        >
            <img
                className={imgClass}
                src={src}
                alt={`${COM_NAME} logo`}
            />
        </div>
    )
}

Logo.defaultProps = {
    mode: 'light',
    type: 'full',
    logoWidth: 'auto',
}

Logo.propTypes = {
    mode: PropTypes.oneOf(['light', 'dark']),
    type: PropTypes.oneOf(['full', 'streamline']),
    gutter: PropTypes.string,
    imgClass: PropTypes.string,
    logoWidth: PropTypes.oneOfType(
        [
            PropTypes.string,
            PropTypes.number
        ]),
}

export default Logo
