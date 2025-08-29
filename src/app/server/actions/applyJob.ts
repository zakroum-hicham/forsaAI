"use server"

export const applyJob = async (formData: any) => {
  "use server"

  const response = await fetch("/api/jobs/apply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to apply for job");
  }

  return response.json();
};
