import { Pagination } from "react-bootstrap";

interface Props {
    totalPages: number;
    page: number;
    start?: number;
    interval?: number;

    selectPage: (data: number) => void
}

export default function IPagination({ totalPages, page, selectPage }: Props) {
    const itens = () => {
        const result = new Array();
        let interval =  totalPages <= 9 ? totalPages :
                        totalPages >= 9 && page <= 9 ? 9 : page; 
        let start = page <= 9 ? 1 : page - 8;

        for (let i = start; i <= interval; i++) {
            result.push(<Pagination.Item
                            active={page === i ? true : false} 
                            onClick={() => selectPage(i)}>{i}
                        </Pagination.Item>
                    );
        }


        return result

    }
    return (
        <Pagination>
            <Pagination.First onClick={() => selectPage(1)} disabled={ page === 1 ? true : false} />
            <Pagination.Prev onClick={() => selectPage(page - 1)} disabled={ page === 1 ? true : false} />
                {itens()}
            <Pagination.Next onClick={() => selectPage(page + 1)} disabled={ page === totalPages ? true : false} />
            <Pagination.Last onClick={() => selectPage(totalPages)} disabled={ page === totalPages ? true : false}/>
        </Pagination>
    )
} 