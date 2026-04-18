'use client'

import { useState } from 'react'
import { Preset, PresetSettings, Stack } from '@/types'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const STACKS: Stack[] = ['Node.js', 'Python', 'Go', 'Java', 'React Native', 'Rust']

interface PresetFormProps {
  preset?: Preset
  onSave: (data: { name: string; settings: PresetSettings }) => void
  onCancel: () => void
}

const defaultSettings: PresetSettings = {
  requireBranchProtection: true,
  createCIDPipeline: true,
  addIssueTemplates: true,
  enforceCodeReview: true,
  addSecurityMD: false,
  addContributingMD: true,
  setUpEnvironments: false,
  stacks: [],
}

const toggleItems: { key: keyof PresetSettings; label: string; description: string }[] = [
  { key: 'requireBranchProtection', label: 'Require branch protection', description: 'Lock main branch with required reviews' },
  { key: 'createCIDPipeline', label: 'Create CI/CD workflow', description: 'Add GitHub Actions pipeline on day one' },
  { key: 'addIssueTemplates', label: 'Add issue templates', description: 'Bug reports and feature request templates' },
  { key: 'enforceCodeReview', label: 'Enforce code review', description: 'Require at least one approving review' },
  { key: 'addSecurityMD', label: 'Add SECURITY.md', description: 'Security vulnerability disclosure policy' },
  { key: 'addContributingMD', label: 'Add CONTRIBUTING.md', description: 'Contribution guidelines for collaborators' },
  { key: 'setUpEnvironments', label: 'Set up environments', description: 'Create production and staging environments' },
]

export function PresetForm({ preset, onSave, onCancel }: PresetFormProps) {
  const [name, setName] = useState(preset?.name ?? '')
  const [settings, setSettings] = useState<PresetSettings>(preset?.settings ?? defaultSettings)

  const handleToggle = (key: keyof PresetSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleStackToggle = (stack: Stack) => {
    setSettings(prev => ({
      ...prev,
      stacks: prev.stacks.includes(stack)
        ? prev.stacks.filter(s => s !== stack)
        : [...prev.stacks, stack],
    }))
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), settings })
  }

  return (
    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl border border-[#e5e7eb]">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[#0a0a0a]">
          {preset ? 'Edit preset' : 'Create new preset'}
        </h2>
        <p className="text-sm text-[#6b7280] mt-1">Configure these settings once and apply them globally.</p>
      </div>

      <div className="space-y-8">
        {/* Preset name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[#0a0a0a]">Preset name</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., Standard Node.js"
            className="h-11 shadow-sm"
          />
        </div>

        {/* Configuration grid */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#0a0a0a]">Standard rules</label>
          <div className="border border-[#e5e7eb] rounded-xl overflow-hidden divide-y divide-[#f3f4f6]">
            {toggleItems.map((item) => (
              <div key={item.key} className="px-5 py-4 bg-white hover:bg-[#fafafa] transition-colors">
                <Toggle
                  checked={settings[item.key] as boolean}
                  onChange={() => handleToggle(item.key)}
                  label={item.label}
                  description={item.description}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Stack targeting */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-[#0a0a0a]">Automatic application</label>
          <p className="text-xs text-[#6b7280] mb-3">Target specific tech stacks to automatically suggest this preset.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STACKS.map(stack => {
              const selected = settings.stacks.includes(stack)
              return (
                <button
                  key={stack}
                  type="button"
                  onClick={() => handleStackToggle(stack)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${
                    selected
                      ? 'border-[#0070f3] bg-[#eff6ff] text-[#0070f3] font-medium shadow-sm'
                      : 'border-[#e5e7eb] bg-white text-[#374151] hover:border-[#d1d5db]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    selected ? 'bg-[#0070f3] border-[#0070f3]' : 'bg-white border-[#d1d5db]'
                  }`}>
                    {selected && (
                      <svg width="10" height="10" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  {stack}
                </button>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6 border-t border-[#e5e7eb]">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1 h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="flex-1 h-11 shadow-sm"
          >
            {preset ? 'Save changes' : 'Create preset'}
          </Button>
        </div>
      </div>
    </div>
  )
}
