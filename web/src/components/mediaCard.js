import Card from 'preact-material-components/Card'

const MediaCard = ({title, subtitle, children, actions}) => (
    <Card>
        <Card.Primary>
            <Card.Title>{title}</Card.Title>
            {subtitle ? (<Card.Subtitle>{subtitle}</Card.Subtitle>) : null}
        </Card.Primary>
        <Card.Media>
            {children}
        </Card.Media>
    </Card>
)

export default MediaCard
