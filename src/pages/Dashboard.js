import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import CTA from '../components/CTA'
import InfoCard from '../components/Cards/InfoCard'
import RoundIcon from '../components/RoundIcon'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../icons'
import PageTitle from '../components/Typography/PageTitle'
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui'
import response from '../utils/demo/tableData'

// Example mappings for status and type
const statusMapping = {
  '0': { text: 'Pending', color: 'yellow' },
  '1': { text: 'In Progress', color: 'blue' },
  '2': { text: 'Completed', color: 'green' },
}

const typeMapping = {
  'type1': { text: 'Type 1', image: '/images/type1.png' },
  'type2': { text: 'Type 2', image: '/images/type2.png' },
  'type3': { text: 'Type 3', image: '/images/type3.png' },
}

function Dashboard() {
  const [page, setPage] = useState(1)
  const [setData] = useState([])
  const [userData, setUserData] = useState(null)
  const router = useRouter()

  // Pagination setup
  const resultsPerPage = 10
  const totalResults = response.length

  // Pagination change control
  function onPageChange(p) {
    setPage(p)
  }

  // On page change, load new sliced data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page])

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get('/api/your-endpoint') // Replace with your actual data endpoint
        if (res.data.status === 401) {
          router.push('/login')
        } else if (res.status === 200) {
          setUserData(res.data)
        } else {
          console.error('Failed to fetch data')
          router.push('/login')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        router.push('/login')
      }
    }

    fetchData()
  }, [router])

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <CTA />

      {/* Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total clients" value={userData?.pending || 'Loading...'}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Account balance" value={`$ ${userData?.accountBalance || 'Loading...'}`}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="New sales" value={userData?.waitcheck || 'Loading...'}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending contacts" value={userData?.progress || 'Loading...'}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>

      {userData && userData.order && (
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Name</TableCell>
                <TableCell>Tasks</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Update Time</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Edit</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {userData.order.map((project, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Avatar className="hidden mr-3 md:block" src={project.avatar} alt="User image" />
                      <div>
                        <p className="font-semibold">{project.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{project.tasks}</span>
                  </TableCell>
                  <TableCell>
                    <Badge type={statusMapping[project.status]?.color}>
                      {statusMapping[project.status]?.text}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{new Date(task.update_time).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <img src={typeMapping[project.type]?.image} alt={typeMapping[project.type]?.text} className="w-6 h-6 mr-2"/>
                      <span className="text-sm">{typeMapping[project.type]?.text}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a href={`/order/${project.id}`} className="text-blue-600 hover:underline">Edit</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                label="Table navigation"
                onChange={onPageChange}
              />
            </TableFooter>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

export default Dashboard
