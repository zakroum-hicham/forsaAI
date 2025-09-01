"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {TextExpander} from "@/components/TextExpander"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Clock, DollarSign, Building2, Search, Filter } from "lucide-react"
import Logo from "@/components/Logo"
import { Job } from "@prisma/client"
import { jobTypeColors } from "@/lib/UI_utils"


export default function JobsPage({allJobs} : { allJobs:Job[]}) {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase());
    //   job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //   job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesLocation =
      locationFilter === "all" || job.location?.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = typeFilter === "all" || job.type.toUpperCase() === typeFilter.toUpperCase()
    // const matchesCategory = categoryFilter === "all" || job.category === categoryFilter

    return matchesSearch && matchesLocation && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            {/* <nav className="hidden md:flex items-center gap-6">
              <Link href="/public/jobs" className="text-blue-600 font-medium">
                Browse Jobs
              </Link>
              <Link href="/dashboard/candidate" className="text-slate-600 hover:text-slate-900 transition-colors">
                Candidate Portal
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </nav> */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Find Your Next Opportunity</h1>
          <p className="text-lg text-slate-600">Discover {allJobs.length} open positions from top companies</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All</SelectItem>
                {[...new Set(allJobs.map(job => job.location))].map((location) => (
                    
                location && <SelectItem key={location} value={location}>
                    {location}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">All Types</SelectItem>
                {[...new Set(allJobs.map(job => job.type))].map((type) => (
                    
                type && <SelectItem key={type} value={type}>
                    {type.toLowerCase()}
                </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">
            Showing {filteredJobs.length} of {allJobs.length} jobs
          </p>
          {/* TODO: add more flters */}
          {/* <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button> */}
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow duration-200 border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 text-slate-900 hover:text-blue-600 cursor-pointer">
                        <Link href={"jobs/"+job.id}>
                      {job.title}
                        </Link>
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      {"company Name"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={jobTypeColors[job.type]}>{job.type}</Badge>
                    <Badge variant="outline">{"categorie"}</Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-3 mb-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">{job.salaryMin +" - "+job.salaryMax}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Posted {new Date(job.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                
                <TextExpander text={job.description} />

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {["skill 1","skill 2", "skill 3","skill 4","skill 5"].slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {["skill 1","skill 2", "skill 3","skill 4","skill 5"].length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{["skill 1","skill 2", "skill 3","skill 4","skill 5"].length - 4} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Save
                    </Button>
                    <Link href={"jobs/"+job.id}>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer">Apply Now</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg mb-4">No jobs found matching your criteria</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setLocationFilter("all")
                setTypeFilter("all")
                setCategoryFilter("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
