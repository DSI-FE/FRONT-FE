const { toast, Notification } = require("components/ui")

const OpenNotification = (type, title, message, placement, duration = 5000) => {
    toast.push((
        <Notification
            className="border-red-100"
            title={title.charAt(0).toUpperCase() + title.slice(1)}
            type={type}
            duration={duration}
        >
            {message}
        </Notification>
    ), { placement: placement })
}

export default OpenNotification;