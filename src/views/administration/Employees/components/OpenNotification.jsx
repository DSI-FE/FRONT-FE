const { toast, Notification } = require("components/ui")

const OpenNotification = (type, title, message, placement, duration = 5000, additionalParams = {}) => {
    toast.push((
        <Notification
            className="border-red-100"
            title={title.charAt(0).toUpperCase() + title.slice(1)}
            type={type}
            duration={duration}
            {...additionalParams}
        >
            {message}
        </Notification>
    ), { placement: placement })
}

export default OpenNotification;