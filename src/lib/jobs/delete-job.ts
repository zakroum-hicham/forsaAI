
export async function deleteJob(jobId: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    setLoading(true)
    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to delete job')
        return
      }
    } catch (err) {
      console.error('Failed to delete job:', err)
      alert('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }
