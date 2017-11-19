import LayoutGrid from 'preact-material-components/LayoutGrid'

const Grid = ({children}) => (
    <LayoutGrid>
        <LayoutGrid.Inner>
            {children}
        </LayoutGrid.Inner>
    </LayoutGrid>
)

const Cell = ({cols, children}) => (
    <LayoutGrid.Cell cols={cols}>
        {children}
    </LayoutGrid.Cell>
)

export {
    Grid,
    Cell,
}

