import { prisma } from '@/lib/prisma'

export interface Version {
  id: string
  workId: string
  data: any
  version: number
  createdAt: Date
}

export async function createVersion(workId: string, data: any): Promise<Version> {
  const lastVersion = await prisma.workVersion.findFirst({
    where: { workId },
    orderBy: { version: 'desc' }
  })

  const version = await prisma.workVersion.create({
    data: {
      workId,
      data,
      version: (lastVersion?.version || 0) + 1
    }
  })

  return version
}

export async function getVersions(workId: string): Promise<Version[]> {
  return prisma.workVersion.findMany({
    where: { workId },
    orderBy: { version: 'desc' }
  })
}

export async function getVersion(workId: string, version: number): Promise<Version | null> {
  return prisma.workVersion.findFirst({
    where: { workId, version }
  })
}

export async function restoreVersion(workId: string, version: number): Promise<void> {
  const versionData = await getVersion(workId, version)
  if (!versionData) {
    throw new Error('Version not found')
  }

  await prisma.work.update({
    where: { id: workId },
    data: versionData.data
  })
} 