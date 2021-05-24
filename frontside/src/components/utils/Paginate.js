import React from 'react'
import { Pagination } from 'react-bootstrap';
import './pages.scss'

export const Paginate = ({totalTicks, ticketsPerPage, page, increaseCount, handleClick, decreaseCount}) => {
    const pageNumber = [];
    for( let i = 1; i <= Math.ceil(totalTicks / ticketsPerPage); i++) {
        pageNumber.push(i)
    }
    return (
        <div>
            <Pagination className='justify-self-center'>
                <Pagination.Prev className={'paginationItemStyle'} onClick={()=> decreaseCount()}/>
                {pageNumber.map(number=>(
                    <Pagination.Item key={number} className={'paginationItemStyle'} active={page === number} onClick={()=>handleClick(number)}>{number}</Pagination.Item>
                ))}
                <Pagination.Next className={'paginationItemStyle'} onClick={() => increaseCount(pageNumber[pageNumber.length -1])}/>
            </Pagination>
        </div>
    )
}


export default Paginate
